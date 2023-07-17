import { jwtVerify } from 'jose';

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error('JWT Secret key is not matched');
  }

  return new TextEncoder().encode(secret); //jose dokumaninda bu sekilde alindi ama buffer oalrakta alinabilir. bunun icin TextEncoder kullanildi.

  // return with buffer
  // return Buffer.from(secret);
}

export async function verifyJwtToken(token) {
  try {
    //jwt HEADER PAYLOAD SIGNATURE seklinde response doner. bu sekilde ayiriyoruz.
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

//jsonWebToken paketide kullanilabilirdi ancak nextjs edge de calismiyor. jsonWebTokenda bu sebeple kullanilamadi.
// alternatif olarak jose paketi kullanildi.
