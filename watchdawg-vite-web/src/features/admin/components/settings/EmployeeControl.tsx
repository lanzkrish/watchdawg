import { Toggle } from "./Toggle";



export function EmployeeControl() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Employee Control</h2>

      <input className='input' placeholder='Idle Timeout (mins)' />

      <Toggle label='Auto Pause Tracking' />
      <Toggle label='Allow Manual Status Change' />
    </div>
  );
}
