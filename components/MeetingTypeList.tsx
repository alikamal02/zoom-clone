'use client';

import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import HomeCard from './HomeCard';
import Loader from './Loader';
import MeetingModal from './MeetingModal';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import 'react-datepicker/dist/react-datepicker.css';
import { database } from '../lib/firebaseConfig';
import { ref, onValue, off } from 'firebase/database';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const normalizeDate = (date: Date): Date => {
  return new Date(date.toISOString().split('T')[0]); // Normalize date to remove time component
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();
  const [bookedTimes, setBookedTimes] = useState<Date[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    const datesRef = ref(database, 'dates');
    onValue(datesRef, (snapshot) => {
      const dates = snapshot.val();
      const loadedDates = [];
      for (let key in dates) {
        if (!dates[key].isBooked) {
          const date = new Date(dates[key].date);
          loadedDates.push(normalizeDate(date));
        }
      }
      setAvailableDates(loadedDates);
    });

    return () => {
      off(datesRef, 'value');
    };
  }, []);

  const isDateAllowed = (date: Date): boolean => {
    const normalizedDate = normalizeDate(date);
    const allowed = availableDates.some(availableDate => availableDate.getTime() === normalizedDate.getTime());
    //console.log("Date:", date, "Normalized Date:", normalizedDate, "Allowed:", allowed);
    return allowed;
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
      if (!call) throw new Error('Gick inte att skapa möte');
      const startsAt = new Date(values.dateTime).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({ data: { starts_at: startsAt, custom: { description } } });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      setBookedTimes([...bookedTimes, values.dateTime]);
      toast({ title: 'Mötet är bokat' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Misslyckades att skapa möte' });
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard img="/icons/add-meeting.svg" title="Nytt direkt möte" description="Påbörja direkt möte" handleClick={() => setMeetingState('isInstantMeeting')} />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Gå med möte"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Tidsbokat möte"
        description="Här klickar du ifall du har bokat möte."
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard img="/icons/recordings.svg" title="Titta på inspelat" description="Inspelade möten" className="bg-yellow-1" handleClick={() => router.push('/recordings')} />

      {!callDetail ? (
        <MeetingModal isOpen={meetingState === 'isScheduleMeeting'} onClose={() => setMeetingState(undefined)} title="Create Meeting" handleClick={createMeeting}>
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">Lägg till text</label>
            <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={e => setValues({ ...values, description: e.target.value })} />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">Välj datum och tid</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date: Date) => setValues({ ...values, dateTime: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              filterDate={isDateAllowed}
              placeholderText="Select a date and time"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Mötet skapat"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Länk kopierad' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Klistra in länk här"
        className="text-center"
        buttonText="Gå med mötet"
        handleClick={() => router.push(values.link)}>
        <Input
          placeholder="Möteslänk"
          onChange={e => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Starta ett nytt möte"
        className="text-center"
        buttonText="Påbörja nytt möte"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
