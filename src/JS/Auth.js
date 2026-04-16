import { loaderState } from "@/loaderState";
import { reactive } from "vue";


// cree este js para centralizar la lógica de auth, así no tenemos que hacer fetch siempre y podemos acceder a la info del user

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authState = reactive({
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
});

export const fetchUserData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/user`, {
            headers: {
                Accept: "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            authState.user = data;
            return true;
        } else {
            localStorage.removeItem("user");
            authState.user = null;
            return false;
        }
    } catch (error) {
        console.error("Error validando usuario:", error);
        localStorage.removeItem("user");
        authState.user = null;
        return false;
    }
};

export const logout = () => {
    fetch(`${BASE_URL}/v1/logout`, {
        method: "POST",
    })
        .then((response) => {
            if (!response.ok) {
                console.error("Error al cerrar sesión en el servidor");
            }
            authState.user = null;
            localStorage.removeItem("user");
            window.location.reload(); // Para que todo resete su estado
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
};

export const verifyUserEmail = async (email, code) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/verify-email`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ email, code }),
        });
        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        console.error("Error validando email:", error);
        return { ok: false, data: { message: "Error de conexión." } };
    }
};

export const resendVerificationEmail = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/v1/resend-verification`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (response.ok) return { ok: true };
        const data = await response.json();
        return { ok: false, message: data.message || "No se pudo reenviar el código." };
    } catch (error) {
        console.error("Error reenviando email:", error);
        return { ok: false, message: "Error de conexión." };
    }
};
