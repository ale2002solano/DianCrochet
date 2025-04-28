const API_URL = "https://vercel-dianas.vercel.app/user";

export const getFacturas = async(correo:string, col: string, dir: string)=>{
    const response = await fetch(`${API_URL}/facturas/${correo}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      columna_ordenamiento: col,
      direccion_ordenamiento: dir,
    }),
  });

  // console.log(JSON.stringify({
  //   columna_ordenamiento: col,
  //   direccion_ordenamiento: dir,
  // }))

  if (!response.ok) {
    throw new Error("Error al traer facturas");
  }

  const data = await response.json();
  return data;
  }

  export const getVideosUsuario = async (correo: string, col: string, dir: string)=>{
    const response = await fetch(`${API_URL}/tutoriales/${correo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columna_ordenamiento: col,
        direccion_ordenamiento: dir,
      }),
    });

    // console.log(JSON.stringify({
    //   columna_ordenamiento: col,
    //   direccion_ordenamiento: dir,
    // }))
  
    if (!response.ok) {
      throw new Error("Error al traer videos");
    }
  
    const data = await response.json();
    return data;
  };
  
  export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://vercel-dianas.vercel.app/admin/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('File upload failed');
      }
  
      const data = await response.json();
      return data.imageUrl; // Devuelve la URL de la imagen cargada
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  };

  export const updateProfilePic = async (correo: string, imageUrl: string) => {
    try {
      const response = await fetch(`https://vercel-dianas.vercel.app/user/actualizar/foto/${correo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nueva_url_imagen: imageUrl }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw new Error('Error updating profile picture');
    }
  };

  export const getKitsUsuario = async (correo: string, col: string, dir: string)=>{
    const response = await fetch(`${API_URL}/kits/${correo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columna_ordenamiento: col,
        direccion_ordenamiento: dir,
      }),
    });

    // console.log(JSON.stringify({
    //   columna_ordenamiento: col,
    //   direccion_ordenamiento: dir,
    // }))
  
    if (!response.ok) {
      throw new Error("Error al traer kits");
    }
  
    const data = await response.json();
    return data;
  };