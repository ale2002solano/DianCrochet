import React, { useEffect, useState } from 'react';
import { User } from '@interfaces/user';
import { useRouter } from 'next/navigation';
import { fetchUser, updateUser } from '@services/UserEdit/useredit';
import { ActualizarUser } from '@interfaces/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';

const UserProfileErick: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ActualizarUser>({
    Nuevo_nombre: '',
    Nuevo_apellido: '',
    Nuevo_genero: '',
    Nuevo_telefono: '',
    Nuevo_fechaNacimiento: ''
  });

  useEffect(() => {
    const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
    const correo = loginResponse.query_result?.CORREO || '';

    if (!correo) {
      console.error("Correo no encontrado en el almacenamiento local.");
      return;
    }

    const loadUser = async () => {
      const userData = await fetchUser(correo);
      if (userData) {
        setUser(userData);
        setFormData({
          Nuevo_nombre: userData.nombre,
          Nuevo_apellido: userData.apellido,
          Nuevo_genero: userData.genero,
          Nuevo_telefono: userData.telefono,
          Nuevo_fechaNacimiento: userData.fecha_nacimiento
        });
      }
    };

    loadUser();
  }, []);

  const router = useRouter();
  const GotoChangePasswd = () => {
    router.push('/profile/change-psw')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    const updatedUser = await updateUser(user.correo, formData);
    if (updatedUser) {
      setUser(updatedUser);
      setEditing(false);
      window.location.reload(); // Recarga la página después de guardar
    } else {
      console.error("No se pudo actualizar la información del usuario.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        Nuevo_nombre: user.nombre,
        Nuevo_apellido: user.apellido,
        Nuevo_genero: user.genero,
        Nuevo_telefono: user.telefono,
        Nuevo_fechaNacimiento: user.fecha_nacimiento
      });
    }
  };



  return (
    <div className=" w-full flex flex-col justify-center lg:pr-28 pr-4 mt-16 lg:px-28">
        {/* datos */}
        <div className=" w-full h-3/4 flex flex-col p-4 justify-center">
           {/* nombre */}
           <div className=' w-full h-12 mt-4 flex flex-row'>
            <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">NOMBRE</label>
            <input
            type="text"
            name="Nuevo_nombre"
            value={editing ? formData.Nuevo_nombre : user?.nombre || ''}
            onChange={handleInputChange}
            disabled={!editing}
            className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
           </div>

           <div className=' w-full h-12 mt-4 flex flex-row'>
            <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">APELLIDO</label>
            <input
            type="text"
            name="Nuevo_apellido"
            value={editing ? formData.Nuevo_apellido : user?.apellido || ''}
            onChange={handleInputChange}
            disabled={!editing}
            className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
           </div>

           <div className=' w-full h-12 mt-4 flex flex-row'>
            <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">TELEFONO</label>
            <input
            type="text"
            name="Nuevo_telefono"
            value={editing ? formData.Nuevo_telefono : user?.telefono || ''}
            onChange={handleInputChange}
            disabled={!editing}
            className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
           </div>

           <div className=' w-full h-12 mt-4 flex flex-row'>
            <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">CORREO</label>
            <input
            type="text"
            name="correo"
            value={user?.correo || ''}
            disabled
            className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
           </div>

           <div className=' w-full sm:h-12 h-24 mt-4 flex sm:flex-row flex-col sm:justify-between'>
             <div className=' sm:w-2/5 w-full h-12 flex flex-row'>
              <label className="text-center w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">FECHA DE NACIMIENTO</label>
              <input
                type={editing ? 'date' : 'text'}
                name="Nuevo_fechaNacimiento"
                value={editing ? formData.Nuevo_fechaNacimiento : user?.fecha_nacimiento || ''}
                onChange={handleInputChange}
                disabled={!editing}
                className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
              />
             </div>

             <div className=' sm:w-2/5 mt-4 sm:mt-0 w-full h-12 flex flex-row'>
             <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">GENERO</label>
              {editing ? (
                      <select
                        name="Nuevo_genero"
                        value={formData.Nuevo_genero}
                        onChange={handleInputChange}
                        className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
                      >
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="Nuevo_genero"
                        value={user?.genero || ''}
                        disabled
                        className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-roboto border-none w-full"
                      />
                    )}
             </div>
             
           </div>

        </div>

        {/* botones */}
        <div className=" w-full h-1/4 p-4">
        {editing ? (
            <div className="space-y-4">
              <button
                onClick={handleSave}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Guardar</h2>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
              </button>
              <button
                onClick={handleCancel}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Cancelar</h2>
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
              </button>
            </div>
          ) : (
            <div className="space-y-4"> {/* Añadido para hacer un stack de botones */}
              <button
                onClick={() => setEditing(true)}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Editar Informacion</h2>
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
              </button>
              <button
                onClick={GotoChangePasswd}
                className="w-60 flex items-center justify-between border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Cambiar Clave</h2>
                <FontAwesomeIcon icon={faLock} className="mr-2" />
              </button>
            </div>
          )}
        </div>

    </div>
  );


};

export default UserProfileErick;
