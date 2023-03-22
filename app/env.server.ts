import { type } from "os"
import invariant from "tiny-invariant"

export function getnEnv() {
    invariant(process.env.ADMIN_EMAIL,"admin email should defined")
    return {ADMIN_EMAIL : process.env.ADMIN_EMAIL}
}


type ENV = ReturnType <typeof getnEnv>

declare global {

    var ENV : ENV
    interface Window {

        ENV : ENV
    }
}