import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'full' }).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="flex h-[303px] w-full items-center justify-center rounded-[20px] bg-cover bg-transparent">
        <div className="flex h-full w-full flex-col items-center justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism rounded py-2 text-center text-base font-normal max-w-[573px]">
          OM DU SKA BOKA TID VÄLJ TIDSBOKA DATUM.
          OM DU SKA ANSLUTA TILL MÖTE VÄLJ ANSLUT TILL MÖTE OCH KLISTRA IN LÄNK DU FICK VID BOKNING.
 <br></br><br></br>
          <strong>Kontakta boka@formd.se ifall du har några frågor kring samtalsbokning.</strong>
    
          </h2>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
