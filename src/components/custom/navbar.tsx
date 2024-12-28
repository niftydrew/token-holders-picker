import { ModeToggle } from './mode-toggle';

export const Navbar = () => {
  return (
    <div className='flex w-full items-center justify-between px-8 py-2 border-b sticky top-0 bg-background'>
      <span>Token Holders Picker</span>
      <ModeToggle />
    </div>
  );
};
