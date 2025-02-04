'use client';
import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdAnalytics, MdEventSeat, MdEmojiEvents } from "react-icons/md";
import { GiHorseHead } from "react-icons/gi";
import { IoMdAnalytics } from "react-icons/io";
import { FaCodeCompare } from "react-icons/fa6";
import RadarChartComponent from "@/components/Dashboard/RadarChart/RadarChart";
import PageNavigation from "@/components/layout/Navigation/Navigation";
import SearchBar from "@/components/layout/SearchBar/SearchBar";
import FilterComponent from "@/components/layout/Filter/Filter";
import { useFetch } from "@/hook/useFetch";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";

interface SortedTraitAverages {
  trait: string;
  avg_score: number;
}

interface TotalResults {
  total_horses: number;
  avg_inbreeding_coefficient: number;
  avg_total_score: number;
  total_events: number;
  avg_top_10_score: number;
  avg_bottom_10_score: number;
  sorted_trait_averages: SortedTraitAverages[];
  most_common_sire_name?: string;
  most_common_dam_name?: string;
  event_with_highest_score_name?: string;
  event_with_highest_score_avg: number;
  total_panels: number;
  avg_panel_score:number;
}


const PulseLoader = () => (
  <span className="inline-block h-4 w-8 bg-gray-300 rounded-md animate-pulse"></span>
);

const Dashboard: React.FC = () => {
  const filters = useSelector((state: RootState) => state.filters) || {};

  const { data: totalResultsData, loading: loadingTotalResults } = useFetch<TotalResults>({
    url: 'total_results',
    filterUrl: 'get_total_results_dynamic',
    limit: 1,
    offset: 0,
    filters: {
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.gender_id ? { gender_id: filters.gender_id } : {}),
      ...(filters.show_id ? { show_id: filters.show_id } : {}),
      ...(filters.farm_id ? { farm_id: filters.farm_id } : {}),
    },
  });


  const defaultData: TotalResults = {
    total_horses: 0,
    avg_inbreeding_coefficient: 0,
    avg_total_score: 0,
    total_events: 0,
    avg_top_10_score: 0,
    avg_bottom_10_score: 0,
    sorted_trait_averages: [],
    most_common_sire_name: "N/A",
    most_common_dam_name: "N/A",
    event_with_highest_score_name: "N/A",
    event_with_highest_score_avg: 0,
    total_panels: 0,
    avg_panel_score:0,
  };
  
  const finalData = totalResultsData?.[0] || defaultData;
  

  const cleanName = (name: string) => {
    const words = name.split(" ");
    return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
  };

  const truncateText = (text: string, maxLength: number = 12) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  const formatValue = useCallback((value: number | null | undefined, decimals = 2) => {
    return loadingTotalResults ? (
      <PulseLoader />
    ) : value !== undefined && value !== null ? (
      parseFloat(value.toFixed(decimals))
    ) : (
      "N/A"
    );
  }, [loadingTotalResults]);
  

  const cardContent = useMemo(
    () => [
      {
        title: "Population Statistics",
        total_txt: "Total horses",
        total: formatValue(finalData.total_horses),
        average_txt: "Average Inbreeding coefficient",
        average: formatValue(finalData.avg_inbreeding_coefficient),
        icons: <MdAnalytics />,
      },
      {
        title: "Horses Overview",
        total_txt: "Total horses",
        total: formatValue(finalData.total_horses),
        average_txt: "Average total score",
        average: formatValue(finalData.avg_total_score),
        icons: <GiHorseHead />,
      },
      {
        title: "Panels Overview",
        total_txt: "Total panels",
        total: formatValue(finalData.total_panels),
        average_txt: "Average score",
        average: formatValue(finalData.avg_panel_score),
        icons: <MdEventSeat />,
      },
      {
        title: "Events Overview",
        total_txt: "Total events",
        total: formatValue(finalData.total_events),
        average_txt: "Highest scoring event",
        average: loadingTotalResults ? (
          <PulseLoader />
        ) : finalData.event_with_highest_score_name ? (
          <div className="relative group flex items-center space-x-1">
            <span className="text-sm sm:text-md font-medium truncate">
              {truncateText(cleanName(finalData.event_with_highest_score_name))}
            </span>
            <span>({formatValue(finalData.event_with_highest_score_avg)})</span>

            <div className="absolute right-0 bottom-full hidden group-hover:block bg-gray-900 text-white text-xs w-[250px] px-2 py-1 rounded-md">
              {finalData.event_with_highest_score_name}
            </div>
          </div>
        ) : (
          "N/A"
        ),
        icons: <MdEmojiEvents />,
      },

      {
        title: "Performance Overview",
        total_txt: "Top performing trait",
        total: finalData.sorted_trait_averages.length
          ? `${finalData.sorted_trait_averages[0].trait} (${formatValue(finalData.sorted_trait_averages[0].avg_score)})`
          : "N/A",
        average_txt: "Second Highest trait",
        average: finalData.sorted_trait_averages.length > 1
          ? `${finalData.sorted_trait_averages[1].trait} (${formatValue(finalData.sorted_trait_averages[1].avg_score)})`
          : "N/A",
        icons: <IoMdAnalytics />,
      },
      {
        title: "Comparison Overview",
        total_txt: "Top 10 average score",
        total: formatValue(finalData.avg_top_10_score),
        average_txt: "Bottom 10 average score",
        average: formatValue(finalData.avg_bottom_10_score),
        icons: <FaCodeCompare />,
      },
    ],
    [finalData, loadingTotalResults]
  );

  const card = cardContent.map(
    ({ title, total_txt, total, average_txt, average, icons }, id) => (
      <Card
        key={id}
        className="p-1 sm:p-4 border-2 border-gray-200 rounded-lg shadow-sm"
      >
        <CardHeader className="md:p-2 mb-5">
          <CardTitle className="text-lg md:text-xl font-semibold flex justify-between items-center">
            <span>{title}</span>
            <span className="text-4xl transform scale-x-[-1]">{icons}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 md:p-2">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-600">{total_txt}</h3>
            <p>{total}</p>
          </div>
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-600">{average_txt}</h3>
            <p>{average}</p>
          </div>
        </CardContent>
      </Card>
    )
  );

  const scrollToSection = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>

      {/* Page Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0 bg-[#f4f4f4] p-2 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
        <div className="text-center md:text-start w-full">
          <h1 className="text-xl md:text-3xl font-bold">
            Alendis Breeding Insights
          </h1>
          <p className="text-sm sm:text-md text-gray-600">
            An overview of key metrics and performance.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-5 items-center w-full lg:w-auto">
          <SearchBar />
          <FilterComponent
          />
        </div>
      </div>

      <PageNavigation scrollToSection={scrollToSection} />

      {/* Population stats */}
      <Card className="flex flex-col lg:flex-row gap-6 justify-between items-center p-5 my-5 overflow-hidden">
        {/* Content Section */}
        <div className="chart_content flex flex-col gap-4 lg:w-1/2">
          <h1 className="font-bold text-lg sm:text-2xl text-center lg:text-left">
            Population Statistics
          </h1>
          <div className="font-medium text-lg text-center lg:text-left flex justify-between lg:justify-start gap-2 lg:gap-4">
            <p>Total Horses: </p>
            <span className="font-bold">
              {loadingTotalResults ? (
                <PulseLoader />
              ) : totalResultsData ? (
                finalData.total_horses
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-[12px] sm:text-sm">
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Average Inbreeding Coefficient:</p>
              <span className="font-medium text-gray-400">
                {loadingTotalResults ? (
                  <PulseLoader />
                ) : totalResultsData ? (
                  parseFloat(finalData.avg_inbreeding_coefficient.toFixed(2))
                ) : (
                  'N/A'
                )}
              </span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Sire:</p>
              <span className="font-medium text-gray-400">
                {loadingTotalResults ? (
                  <PulseLoader />
                ) : totalResultsData ? (
                  finalData.most_common_sire_name
                ) : (
                  'N/A'
                )}
              </span>
            </div>
            <div className="flex justify-between lg:justify-start gap-2 lg:gap-4">
              <p>Most Common Dam:</p>
              <span className="font-medium text-gray-400">
                {loadingTotalResults ? (
                  <PulseLoader />
                ) : totalResultsData ? (
                  finalData.most_common_dam_name
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center lg:w-1/2">
          <RadarChartComponent filters={filters} />
        </div>
      </Card>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
        {card}
      </div>

    </>
  );
};

export default Dashboard;
