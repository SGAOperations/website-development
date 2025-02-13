import SplitText from '../blocks/TextAnimations/SplitText/SplitText';
import sgaLogo from '../assets/sga-logo.png';
import HeaderDropdowns from './HeaderDropdowns';

export default function Header() {
  return (
    <div className="relative w-screen">
      <header 
        className="flex flex-col justify-center items-center h-auto w-screen relative top-0 p-5" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="flex items-center">
          <SplitText
            text="SGA"
            className="text-9xl font-bold text-sga-red text-center"
            delay={100}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
            threshold={0.1}
            rootMargin="0px"
          /> 
          <div className="inline-block h-[180px] min-h-[1em] w-1 self-stretch bg-dark dark:bg-black mx-8"></div>
          <img src={sgaLogo} alt="SGA Logo" className="w-52 h-auto" />
        </div>
        <div className="mt-4">
          <HeaderDropdowns />
        </div>
      </header>
    </div>
  );
}