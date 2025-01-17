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
import { useFetch } from "@/hook/useFetch";

interface CardContentType {
  title: string;
  total_txt: string;
  total: string | number;
  average_txt: string;
  average: string | number;
  icons: React.ReactNode;
}

type SortedTraitAverages = {
  trait: string ;
  avg_score: number;
}

type Data = {
  total_horses: number ;
  avg_inbreeding_coefficient : number ;
  avg_total_score: number ;
  total_events: number ;
  avg_top_10_score: number ;
  avg_bottom_10_score: number ;
  sorted_trait_averages: SortedTraitAverages[];
  most_common_sire_name: string | null;
  most_common_dam_name: string | null;
}

const Dashboard: React.FC = () => {

  const { data } = useFetch<Data>('total_results')

  const cardContent: CardContentType[] = [
    {
      title: "Population Statistics",
      total_txt: "Total horses",
      total: data ? data[0].total_horses : 'N/A',
      average_txt: "Average Inbreeding coefficient",
      average: data ? parseFloat(data[0].avg_inbreeding_coefficient.toFixed(2)) : 'N/A', 
      icons: <MdAnalytics />,
    },
    {
      title: "Horses Overview",
      total_txt: "Total horses",
      total: data ? data[0].total_horses : 'N/A',
      average_txt: "Average total score",
      average: data ? parseFloat(data[0].avg_total_score.toFixed(2)) : 'N/A', 
      icons: <GiHorseHead />,
    },
    {
      title: "Panels Overview",
      total_txt: "Total panels",
      total: "51",
      average_txt: "Average consistency score",
      average: "121", 
      icons: <MdEventSeat />,
    },
    {
      title: "Events Overview",
      total_txt: "Total events",
      total: data ? data[0].total_events : 'N/A',
      average_txt: "Highest scoring event",
      average: "Summer Show Reykjavík (8.7)", 
      icons: <MdEmojiEvents />,
    },
    {
      title: "Performance Overview",
      total_txt: "Top performing trait",
      total: data ? data[0].sorted_trait_averages[0].trait  + ` (${parseFloat(data[0].sorted_trait_averages[0].avg_score.toFixed(2))})` : 'N/A', 
      average_txt: "Second Highest trait",
      average:  data ? data[0].sorted_trait_averages[1].trait  + ` (${parseFloat(data[0].sorted_trait_averages[1].avg_score.toFixed(2))})` : 'N/A', 
      icons: <IoMdAnalytics />,
    },
    {
      title: "Comparison Overview",
      total_txt: "Top 10 average score",
      total: data ? parseFloat(data[0].avg_top_10_score.toFixed(2)) : 'N/A', 
      average_txt: "Bottom 10 average score",
      average: data ? parseFloat(data[0].avg_bottom_10_score.toFixed(2)) : 'N/A',  
      icons: <FaCodeCompare />,
    },
  ];  

  const card = cardContent.map((value, id) => (
    <Card key={id} className="p-1 sm:p-4 border-2 border-gray-200 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold flex justify-between items-center">
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
          <h1 className="font-bold text-lg sm:text-2xl text-center lg:text-left">
            Population Statistics
          </h1>
          <p className="font-medium text-lg text-center lg:text-left">
            Total Horses: <span className="font-bold">{ data ? data[0].total_horses : 'N/A' }</span>
          </p>
          <div className="flex flex-col gap-2 text-[12px] sm:text-sm">
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Average Inbreeding Coefficient:</p>
              <span className="font-medium text-gray-400">{ data ? parseFloat(data[0].avg_inbreeding_coefficient.toFixed(2)) : 'N/A' }</span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Sire:</p>
              <span className="font-medium text-gray-400">{ data ? data[0]?.most_common_sire_name : 'N//A' }</span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Dam:</p>
              <span className="font-medium text-gray-400">{ data ? data[0]?.most_common_dam_name : 'N//A' }</span>
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
