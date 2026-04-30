import { Toggle } from "./Toggle";


export function Security() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Security</h2>

      <Toggle label='Strong Password Required' />
      <input className='input' placeholder='Session Timeout (mins)' />
    </div>
  );
}
