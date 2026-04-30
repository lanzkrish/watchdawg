import { Toggle } from "./Toggle";



export function Tracking() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Tracking</h2>

      <select className='input'>
        <option>Strict</option>
        <option>Balanced</option>
        <option>Relaxed</option>
      </select>

      <Toggle label='Track Applications' />
    </div>
  );
}
