"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import { Button } from "@/registry/new-york-v4/ui/button"

interface AuthNavProps {
  user?: {
    name: string
    avatar?: string
  }
}

/**
 * Displays authentication actions in the navbar. If a user object is provided, it shows the user's avatar; otherwise it renders
 * "Sign In" and "Get Started" buttons.
 */
export function AuthNav({ user }: AuthNavProps) {
  if (user) {
    return (
      <Link href="/dashboard" className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : null}
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
          {user.name}
        </span>
      </Link>
    )
  }

  return (
    <>
      <Button variant="ghost" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Get Started</Link>
      </Button>
    </>
  )
}
