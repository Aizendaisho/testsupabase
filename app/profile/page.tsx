// components/Profile.tsx
'use client';

import { useAuthStore } from '@/store/authStore';

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-4">
      {user ? (
        <p>Bienvenido, {user.user_metadata?.full_name || user.email}</p>
      ) : (
        <p>No hay usuario logueado</p>
      )}
    </div>
  );
};

export default Profile;
