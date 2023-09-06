import {useLoaderData} from '@remix-run/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useMatches } from '@remix-run/react';

export function meta() {
  return [
    {title: 'Rachel Lopez Photography'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export function Layout({children}) {
//   const data = useLoaderData();
  const data = useMatches();
  const showHeaderAndFooter = data[1].pathname == "/" ? true : false;


  return (
    <div className="flex flex-col min-h-screen antialiased bg-white">
      {
        showHeaderAndFooter
        ? <Header header={data[0].data}/>
        : null
      }
      <main
        role="main"
        id="mainContent"
        className=""
      >
          {children}
        {
          showHeaderAndFooter
            ? <Footer img={data[0].data.shop.brand.squareLogo.image} footerTxt={`© ${new Date().getFullYear()} RACHEL LOPEZ | POWERED BY ANTOINE MEDIA LLC`}/>
            : null
        }
      </main>
    </div>
  );
}




