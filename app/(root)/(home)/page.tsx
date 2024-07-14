import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const now = new Date();
  now.setHours(now.getHours() ); // Adds two hours to the current time

  const time = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'full' }).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="flex h-[303px] w-full items-center justify-center rounded-[20px] bg-cover bg-transparent flex-col">
        <div className="flex flex-col items-center gap-2 mb-2 pt-4">
          <h1 className="text-xl font-extrabold lg:text-4xl">{time}</h1>
          <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism rounded py-2 text-center text-base font-normal max-w-[573px]">
            OM DU SKA BOKA TID:
            <br />
            Välj <strong>"Tidsboka Datum"</strong>.
            <br /><br />
            OM DU SKA ANSLUTA TILL MÖTE:
            <br />
            Välj <strong>"Anslut till Möte"</strong> och klistra in länken du fick vid bokning.
            <br />
            <p>Vid bokning godkänner du att få samtal inspelade, vill du att inspelade videos ska raderas eller andra frågor kontakta oss på kontakt@formd.se</p>
            <br />
            <strong>Kontakta <a href="mailto:boka@formd.se">boka@formd.se</a> ifall du har några frågor kring samtalsbokning.</strong>
          </h2>
        </div>
      </div>
  
      <MeetingTypeList />
    </section>
  );
};

export default Home;
