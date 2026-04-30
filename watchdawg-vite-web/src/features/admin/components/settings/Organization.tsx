export function Organization() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Organization</h2>

      <input className='input' placeholder='Company Name' />
      <input className='input' placeholder='Timezone' />
      <input className='input' placeholder='Working Hours (9-6)' />
    </div>
  );
}
