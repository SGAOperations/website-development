import Header from '../../components/Header';
import Footer from '../../components/Footer';
import structureImage from '../../assets/structure.png';


export default function Structure() {
  return (
    <div>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8 uppercase">Structure</div>

        <p className="text-center text-black mx-30 mt-6 mb-2 text-left">
        The Northeastern Student Government Association (SGA) is structured into three branches: Legislative, Executive, and Judicial. The diagram below shows a detailed view of all the different divisions that SGA is split into.
        </p>
        <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">Legislative Branch</h3>
        <p className="text-black text-left ml-8 mt-6 mb-2">
           Our Senate forms the core of the Legislative Branch, comprising students representing Northeastern’s academic colleges and student organizations and voting on legislation.
         </p>
         <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">Executive Branch</h3>
         <p className="text-black text-left ml-8 mt-6 mb-2">
           This branch includes the Office of the President (Student Body President & Executive Vice President) and various SGA Divisions managed by our Divisional Vice Presidents & Executive Directors. These divisions encompass numerous committees, boards, and working groups dedicated to the SGA's functionality, spearheading projects to enhance the student experience and managing the funding and oversight of Northeastern’s 500+ recognized student organizations.
         </p>
         <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">Judicial Branch</h3>
         <p className="text-black text-left ml-8 mt-6 mb-2">
           The Operational Appeals Board constitutes our Judicial Branch. It is responsible for hearing students' appeals concerning alleged violations of the Association’s governing documents by other SGA boards and committees.
         </p>
         <img src={structureImage} alt="Structure Image"/>

      <Footer />
    </div>
  );
}