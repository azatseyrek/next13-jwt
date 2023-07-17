import { NextResponse } from 'next/server';

import { getJwtSecretKey } from '@/libs/auth';
import { SignJWT } from 'jose';

export async function POST(request) {
  const body = await request.json();

  // normlade burda dbye gidilip chek edilir kullanici var mi diye.

  if (body.username === 'admin' && body.password === 'admin') {
    // genrete token
    const token = await new SignJWT({
      username: body.username,
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2 hour')
      .sign(getJwtSecretKey());

    //set cookie

    const response = NextResponse.json({
      success: true,
      token,
    });

    response.cookies.set({
      name: 'token',
      value: token,
      path: '/',
    });
    return response;
  } else {
    return NextResponse.json({
      success: false,
      message: 'Username or password is wrong!',
    });
  }
}
