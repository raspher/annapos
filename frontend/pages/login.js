'use client';
import { useRouter } from "next/router";
import JSON from "qs";

export default function Login() {
    const router = useRouter()

    async function handleSubmit(event) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
            await router.push('/')
        } else {
            console.log("Error on login: ", response)
        }
    }

    return (
        <div className="flex flex-wrap h-lvh w-lvw justify-center content-center">
            <form onSubmit={handleSubmit} className="flex flex-wrap w-1/2 p-8">
                <input type="email" name="email" placeholder="Email" required className="w-full p-4 m-2 bg-gray-500 rounded-2xl" />
                <input type="password" name="password" placeholder="Password" required className="w-full p-4 m-2 bg-gray-500 rounded-2xl" />
                <button type="submit" className="w-full p-4 m-2 bg-blue-500 rounded-2xl">Login</button>
            </form>
        </div>
    )
}