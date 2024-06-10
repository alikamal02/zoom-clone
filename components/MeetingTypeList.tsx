/* eslint-disable camelcase */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebaseConfig'; // Ensure this path is correct

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

interface DateEntry {
  date: string;
  isBooked: boolean;
}

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    console.log("useEffect called");
    const datesRef = ref(database, 'dates');
    onValue(datesRef, (snapshot) => {
      const data: Record<string, DateEntry> | null = snapshot.val();
      console.log("Data from Firebase:", data);
      if (data) {
        const dates = Object.entries(data)
          .filter(([_, value]) => !value.isBooked)
          .map(([_, value]) => new Date(value.date));
       
        console.log("Filtered dates:", dates);
        setAvailableDates(dates);
      } else {
        console.log("No data available");
      }
    }, (error) => {
      console.error("Error fetching data:", error);
    });
  }, []);
  const handleDateChange = (date: Date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(date.getHours() - 2);
    setValues({ ...values, dateTime: adjustedDate });
  };
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Välj datum och tid' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Möte';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Möte är skapad',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      
    
      
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Anslut till möte"
        description="Anslut via länk"
        className="bg-purple-600"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Tidsboka möte"
        description="Boka ditt möte"
        className="bg-purple-600"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="Se inspelning"
        description="Inspelningar"
        className="bg-purple-500" 
        handleClick={() => router.push('/recordings')}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Skapa möte"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
             Lägg till noteringar
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Välj datum och tid
            </label>
            <ReactDatePicker
        selected={values.dateTime}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        className="w-full rounded bg-dark-3 p-2 focus:outline-none"
        filterDate={(date) => availableDates.some(d => d.toDateString() === date.toDateString())}
        filterTime={(time) => availableDates.some(d => d.getTime() === time.getTime())}
      />

          </div>
          <div>
            <h2>Lediga datum och tider:</h2>
            <ul>
              {availableDates.map((date, index) => (
                <li key={index}>{date.toString()}</li>
              ))}
            </ul>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Mötet är skapad"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Länk är kopierad' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Kopiera länk"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Bifoga länk här"
        className="text-center"
        buttonText="Anslut till möte"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Mötes länk"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Starta direkt möte"
        className="text-center"
        buttonText="Starta möte"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
