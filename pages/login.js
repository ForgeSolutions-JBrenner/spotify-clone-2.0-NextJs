import { getProviders, signIn } from "next-auth/react";

function Login({providers}) {
  return (
    <div className="flex flex-col items-center justify-evenly bg-[#171717] min-h-screen justify-center ">
      <img
        className="w-52 mb-5"
        alt="Welcome to Spotify"
        src="https://links.papareact.com/9xl"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="bg-[#18D860] rounded-full text-white p-5 hover:scale-125"
          onClick={() => signIn(provider.id, {callbackUrl: "/"})}
          >Login with {provider.name}</button>
        </div>
      ))}
    </div>
  );
}

export default Login;
//Server side render, this will render out the page on the server
//and deliver it out to the clients
export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
