import { Toggle } from "./Toggle";



export function Notifications() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Notifications</h2>

      <Toggle label='Email Notifications' />
      <Toggle label='Weekly Reports' />
    </div>
  );
}
