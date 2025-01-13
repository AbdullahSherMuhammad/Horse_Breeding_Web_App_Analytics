'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdAnalytics } from "react-icons/md";
import { GiHorseHead } from "react-icons/gi";
import { MdEventSeat, MdEmojiEvents } from "react-icons/md";
import { IoMdAnalytics } from "react-icons/io";
import { FaCodeCompare } from "react-icons/fa6";
import RadarChartComponent from "./components/RadarChart/RadarChart";
import FilterComponent from "@/components/Filter/page";
import PageNavigation from "@/components/layout/Navigation/Navigation";
import CountryFilter from "@/components/CountryFilter/CountryFilter";
import SearchBar from "./components/SearchBar/SearchBar";
import { TopList } from "@/components/TopList/TopList";

interface CardContentType {
  title: string;
  total_txt: string;
  total: string | number;
  average_txt: string;
  average: string | number;
  icons: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const cardContent: CardContentType[] = [
    {
      title: "Population Statistics",
      total_txt: "Total horses",
      total: "3",
      average_txt: "Average Inbreeding coefficient",
      average: "8.5",
      icons: <MdAnalytics />,
    },
    {
      title: "Horses Overview",
      total_txt: "Total horses",
      total: "2000",
      average_txt: "Average total score",
      average: "8.5",
      icons: <GiHorseHead />,
    },
    {
      title: "Panels Overview",
      total_txt: "Total panels",
      total: "10",
      average_txt: "Average consistency score",
      average: "0.85",
      icons: <MdEventSeat />,
    },
    {
      title: "Events Overview",
      total_txt: "Total events",
      total: "15",
      average_txt: "Highest scoring event",
      average: "Summer Show Reykjavík (8.7)",
      icons: <MdEmojiEvents />,
    },
    {
      title: "Performance Overview",
      total_txt: "Top performing trait",
      total: "Tölt (8.8)",
      average_txt: "Most improved trait",
      average: "Pace (+0.3)",
      icons: <IoMdAnalytics />,
    },
    {
      title: "Comparison Overview",
      total_txt: "Top 10% average score",
      total: "9.1",
      average_txt: "Bottom 10% average score",
      average: "7.9",
      icons: <FaCodeCompare />,
    },
  ];

  const card = cardContent.map((value, id) => (
    <Card key={id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          <span>{value.title}</span>
          <span className="text-4xl transform scale-x-[-1]">{value.icons}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-600">{value.total_txt}:</h3>
          <p>{value.total}</p>
        </div>
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-600">{value.average_txt}:</h3>
          <p>{value.average}</p>
        </div>
      </CardContent>
    </Card>
  ));

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="text-center md:text-start w-full">
          <h1 className="text-xl md:text-3xl font-bold">Alendis Breeding Insights</h1>
          <p className="text-sm sm:text-md text-gray-600">An overview of key metrics and performance.</p>
        </div>
        <div className="flex justify-end items-center gap-5 w-full md:w-auto">
          <CountryFilter/>
          <FilterComponent/>
          <div className="hidden lg:flex"><SearchBar /></div>
        </div>
      </div>

      <div className="w-full flex lg:hidden justify-end mb-10 lg:m-0">
        <SearchBar/> 
      </div>

      <PageNavigation
         scrollToSection={scrollToSection} 
      />

      <Card className="flex flex-col lg:flex-row gap-6 justify-between items-center p-5 my-5 overflow-hidden">
        {/* Content Section */}
        <div className="chart_content flex flex-col gap-4 lg:w-1/2">
          <h1 className="font-bold text-2xl text-center lg:text-left">
            Population Statistics
          </h1>
          <p className="font-medium text-lg text-center lg:text-left">
            Total Horses: <span className="font-bold">3</span>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Average Inbreeding Coefficient:</p>
              <span className="font-medium text-gray-400">2.90%</span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Sire:</p>
              <span className="font-medium text-gray-400">Skýr frá Skálakoti</span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Dam:</p>
              <span className="font-medium text-gray-400">Perla frá Stóra-Hofi</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center lg:w-1/2">
          <RadarChartComponent />
        </div>
      </Card>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">{card}</div>

      <TopList/>

    </>
  );
};

export default Dashboard;
