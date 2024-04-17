import ImpactVectorCard from "./ImpactVectorCard";
import SearchVectors from "./SearchVectors";
import { useFetch } from "usehooks-ts";
import { Vector } from "~~/app/types/data";

const ImpactVectorDisplay = () => {
  const { data: vectors } = useFetch<Vector[]>("/api/vectors");

  return (
    <>
      <SearchVectors data={vectors} placeholder="Search Impact Vectors" />
      <div
        className="max-h-[700px] min-h-[70vh] overflow-y-auto
      scrollbar-w-2 scrollbar scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full pb-6"
      >
        {vectors &&
          vectors.length > 0 &&
          vectors.map((vector, index) => <ImpactVectorCard key={index} vector={vector} />)}
        {vectors && vectors?.length === 0 ? <h2 className="text-center">No results</h2> : <></>}
      </div>
    </>
  );
};

export default ImpactVectorDisplay;
