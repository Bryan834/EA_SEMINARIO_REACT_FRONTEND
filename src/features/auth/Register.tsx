import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from './authService';
import type { User } from '../../modules/user';
import './AuthForm.css'; 
import { toast } from 'react-toastify';


type RegisterFormData = User & {//añadimos el atributo a los que YA TIENE user
  confirmPassword?: string;
};

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  
  const navigate = useNavigate();

  // 'watch' nos deja ver el valor de 'password' para poder compararlo
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {

// esto basicamente esxluye el primer atributo del objeto data
// y crea un nou objecte sense aquest atribut
    const { confirmPassword, ...userCredentials } = data;

    try {
      await registerService(userCredentials);
      
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login'); // Redirige al login
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error en el registro');
    }
  };

  return (
    <div className="auth-container">

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <p className="title">Register</p>
        <p className="message">Regístrate para tener acceso completo.</p>
        
        <label>
          <input
            className="input"
            type="text"
            placeholder=" "
            {...register('username', { required: 'El nombre de usuario es obligatorio' })}
          />
          <span>Username</span>
        </label>
        {errors.username && <p className="input-error">{errors.username.message}</p>}

        <label>
          <input
            className="input"
            type="email"
            placeholder=" "
            {...register('gmail', { required: 'El email es obligatorio' })}
          />
          <span>Email</span>
        </label>
        {errors.gmail && <p className="input-error">{errors.gmail.message}</p>}

        <label>
          <input
            className="input"
            type="date"
            placeholder=" "
            {...register('birthday', { 
              required: 'La fecha de nacimiento es obligatoria',
              valueAsDate: true, 
            })}
          />
          <span>Fecha de Nacimiento</span>
        </label>
        {errors.birthday && <p className="input-error">{errors.birthday.message}</p>}

        <label>
          <input
            className="input"
            type="password"
            placeholder=" "
            {...register('password', { required: 'La contraseña es obligatoria' })}
          />
          <span>Password</span>
        </label>
        {errors.password && <p className="input-error">{errors.password.message}</p>}

        <label>
          <input
            className="input"
            type="password"
            placeholder=" "
            {...register('confirmPassword', {
              required: 'Confirma la contraseña',
              validate: (value) =>
                value === password || 'Las contraseñas no coinciden',
            })}
          />
          <span>Confirmar Password</span>
        </label>
        {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}

        <button type="submit" className="submit">Registrarse</button>
        <p className="signin">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};