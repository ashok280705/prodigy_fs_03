'use client'
import React from 'react'
import { useSession, getSession } from "next-auth/react"
import { redirect } from 'next/navigation';
const page = () => {
     const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    redirect('/login');
  }
  return (
    <div>hello</div>
  )
}

export default page