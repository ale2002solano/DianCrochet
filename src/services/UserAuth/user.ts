import { loginData, RegisterData, ResetPwdResponse, verifyCode } from "@interfaces/user";

const API_URL = "https://deploybackenddiancrochet.onrender.com/user";

// Función para hacer el POST del login
export const login = async (data: loginData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error en el inicio de sesión");
  }

  return response.json();
};

export const register = async (data: RegisterData) => {
  const response = await fetch(`${API_URL}/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // console.log('registro completado')
  if (!response.ok) {
    throw new Error("Error al iniciar registro");
  }

  return response.json();
};

export const verifyEmailRegister = async (data: verifyCode) => {
  const response = await fetch(`${API_URL}/validar/registro`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al verificar codigo");
  }

  return response.json();
};

export const resendCode = async(correo: string) =>{
  const response = await fetch(`${API_URL}/nuevo/codigo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo }),
  });
  // console.log("json: ",  JSON.stringify({ correo }))

  if (!response.ok) {
    throw new Error("Error al verificar codigo");
  }

  return response.json();
}

export const passwordVerify = async(contrasena: string) =>{
  const response = await fetch(`${API_URL}/contrasena/segura`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contrasena }),
  });
  // console.log('Service ', response)
  if (!response.ok) {
    throw new Error("Error al validar contraseña");
  }

  return response.json();
}

//Restablecer contraseña enviar correo 

export const resetPassword = async (correo: string) => {
  const response = await fetch(`${API_URL}/correo/restablecer/contrasena`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo }),
  });

  if (!response.ok) {
    throw new Error("Error al restablecer la contraseña");
  }

  return response.json();
};

// Validar correo


export const validarCorreo = async (correo: string, codigoVeri: string) => {
    const response = await fetch(`${API_URL}/validar/correo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, codigoVeri }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Error al verificar el código");
    }
    return data;
    
};


// Restablecer la contraseña
export const resetPwd = async (correo: string, nuevaContrasena: string): Promise<ResetPwdResponse> => {
  const response = await fetch(`${API_URL}/restablecer/contrasena`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, nuevaContrasena }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al restablecer la contraseña");
  }

  return response.json() as Promise<ResetPwdResponse>;
};