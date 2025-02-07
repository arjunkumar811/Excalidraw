"use client"

export function AuthPage({isSignIn}: {
    isSignIn: boolean
}) {
    return <div className="w-screen h-screen flex justify-center items-center">

<div className="p-2 m-2 bg-white rounded-lg">

<input type="text" placeholder="Email"></input>
<input type="text" placeholder="Password" typeof="password"></input>

<button onClick={() => {

}}>{isSignIn? "Sign in" : "Sign up"}</button>


</div>

    </div>
}