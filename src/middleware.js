import { NextResponse } from 'next/server';

import { verifyJwtToken } from '@/libs/auth';

// isAuthPages kismini aslinda baska bir yerde tutmamiz lazim!
const AUTH_PAGES = ['/login', '/register'];

const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request) {
  const { url, nextUrl, cookies } = request;
  const { value: token } = cookies.get('token') ?? { value: null };

  console.log('custom token', token); //el ile kendimizi bir token girdigimizde consloe da bunu goruruz. Ancak jose araciligi ile bunu hasVerifiedToken ile kontrol edebiliriz.

  const hasVerifiedToken = token && (await verifyJwtToken(token));
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  console.log('hasVerifiedToken', hasVerifiedToken);

  // Burdaki kontrol etme sebebimiz eger login sayfasina gidersek ve token varsa login sayfasina gitmesini istemiyoruz. Bu sebeple bu kontrolu yapiyoruz.
  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();

      return response;
    }

    const response = NextResponse.redirect(new URL('/', url));
    return response;
  }

  if (!hasVerifiedToken) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set('nextUrl', nextUrl.pathname); //Bunu yapma sebebi login sayfasina gittigimizde login sayfasindan sonra nereye gidecegimizi belirtmek icin bu sekilde bir yontem kullanildi. Digelim bir reklama tikladik ve login sayfasina gittik. Login sayfasindan sonra  asil gitmek istedigimiz yeri hatrlamak icin bu sekilde bir yontem kullanildi.

    return NextResponse.redirect(new URL(`/login?${searchParams}`, url));
  }
  return NextResponse.next();
}
// public olmayan sayfalari belirtmek icin middleware ihtiyacimiz olan kisimlari belirtiyoruz.
export const config = { matcher: ['/login', '/panel/:path*', '/azat'] };
