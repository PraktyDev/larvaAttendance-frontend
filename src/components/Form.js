"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Oval  } from 'react-loader-spinner'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const { reset } = form
  const { isDirty, isValid, isSubmitting, isSubmitSuccessful } = form.formState
 
  const onSubmit = async (values) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tutor/login`, values);
      localStorage.setItem('accessToken', response.data.accessToken);
      toast("Login success")
      router.push('/dashboard')
    } catch (error) {
      const err = error.response.data.msg
      toast(err);
    }
  }

  useEffect(()=>{
    if(isSubmitSuccessful){
      reset()
    }
  },[isSubmitSuccessful, reset])

  return (
    <Form {...form}>
      <div className="flex flex-col w-full m-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-7 w-full tablet:w-[417px] flex flex-col m-auto">
        <div className="mb-3 space-y-3">
          <Image src="/images/larvaLogo.png" className="w-auto h-auto" alt="larva logo" width={100} height={100}/>
          <h1 className="font-semibold">Log in to your account</h1>          
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="bg-slate-100 rounded-md" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="bg-slate-100 rounded-md mb-2" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-[#F39B3B] hover:bg-orange-400 text-white rounded-lg" type="submit" disabled={!isDirty || !isValid} >
          {isSubmitting 
            ? <div className="flex gap-3 items-center justify-center"><Oval visible={true} height="18" width="18" color="white" ariaLabel="oval-loading" /> <p>Loading...</p></div>
            : <div>Log in as Tutor</div>
          }
        </Button>
      </form>
      <Link href={'/admin'} className="text-center text-xs hover:text-slate-600 text-black font-semibold mt-3">Admin</Link>
      </div>
    </Form>
  )
}