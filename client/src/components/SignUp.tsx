import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

import FormWrapper from './FormWrapper'
import { registerUser } from '../api'
import { generateVaultKey, hashPassword } from '../crypto'

const SignUp = ({ setVaultKey, setStep }:{
  setVaultKey: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<'login' | 'register' | 'vault'>>;
}) => {
  const { register, handleSubmit, getValues, setValue, formState: {errors, isSubmitting } } = useForm<{email: string, password: string, hashedPassword: string}>();

  const mutation = useMutation(registerUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues('hashedPassword');
      const email = getValues('email');
      const vaultKey = generateVaultKey({ hashedPassword, email, salt });
      window.sessionStorage.setItem('vaultKey', vaultKey);
      setVaultKey(vaultKey);
      window.sessionStorage.setItem('vault', '');
      setStep('vault');
    }
  });

  return (
    <FormWrapper onSubmit={handleSubmit(() => {
      const password = getValues('password');
      const email = getValues('email');
      const hashedPassword = hashPassword(password);
      setValue('hashedPassword', hashedPassword);
      mutation.mutate({
        email,
        hashedPassword
      });
    })}>
      <Heading>Sign Up</Heading>
      <FormControl mt="4">
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input id='email' type='email' placeholder='Email' 
        {...register("email", {
          required: "An email is required",
          minLength: { value: 6, message: "Email must be at least 6 characters" },
        })}
        />
        <FormErrorMessage>
          {errors.email && errors.email?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl mt="4">
        <FormLabel htmlFor='password'>Password</FormLabel>
        <Input id='password' type='password' placeholder='Password' 
        {...register("password", {
          required: "A password is required",
          minLength: { value: 8, message: "password must be at least 8 characters" },
        })}
        />
        <FormErrorMessage>
          {errors.password && errors.password?.message}
        </FormErrorMessage>
      </FormControl>
      <Button type='submit' colorScheme='blue' mt={4}>
        Register
      </Button>
    </FormWrapper>
  )
}

export default SignUp