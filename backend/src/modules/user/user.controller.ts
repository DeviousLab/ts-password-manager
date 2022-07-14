import { FastifyRequest, FastifyReply } from "fastify";

import { createVault } from "../vault/vault.service";
import { createUser, generateSalt } from "./user.service";
import { COOKIE_DOMAIN } from "../../constants";
import logger from "../../utils/logger";

export async function registerUserHandler(request: FastifyRequest<{
  Body: Parameters<typeof createUser>[number]
}>, reply: FastifyReply) {
  const body = request.body;
  try {
    const user = await createUser(body);
    const salt = generateSalt();
    const vault = await createVault({ user: user._id, salt });
    const accessToken = await reply.jwtSign({
      _id: user._id,
      email: user.email,
    });
    reply.setCookie("token", accessToken, {
      domain: COOKIE_DOMAIN,
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: false
    });
    return reply.code(201).send({
      accessToken,
      vault: vault.data,
      salt
    });
  } catch (error) {
    logger.error(error, "Error while registering user");
    return reply.code(500).send(error);
  }
}