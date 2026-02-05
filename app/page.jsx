'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"




function page() {

  let router = useRouter()

  useEffect(() => {
    router.push("pizza")
  }, [])
  return (
    <div>page</div>
  )
}

export default page