import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Template() {
  return (
    <div>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8 uppercase">header</div>
      <p className="text-center text-black mx-30 mt-6 mb-2 text-left">
       text
      </p>
      <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8 uppercase">subheading</h3>
      <p className="text-black text-left ml-8 mt-6 mb-2"> 
        text 
      </p>
      <Footer />
    </div>
  );
}

