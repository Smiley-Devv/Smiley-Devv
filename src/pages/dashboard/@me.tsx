import React, { useEffect, useState  } from 'react';
import { parseCookies } from 'nookies';
import { URLS, User } from '../../types';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import NavBar from '../../components/NavBar';

export default function DashboardUser({ token }) {
  const [user, setUser] = useState<User | null | any>(null);

  useEffect(() => {
    (async() => {
      if(user) setUser(user)
      else {
        const res = await axios.get(URLS.USER, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        console.log("fetch")
        setUser(data);
      }
    })()
  }, [user])
  
  return (
    <main>
        <NavBar user={user} />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async(ctx) => {
  const { ['lunarydash.token']: token } = parseCookies(ctx)
  
  if(!token) return {
    redirect: {
      destination: '/api/auth/login',
      permanent: false
    }
  }

  return {
    props: {
      token
    }
  }
}