import EcommerceMetrics from "./components/ecom-metrics";
import RecentUsers from "./components/recent-users";
import PageMeta from "../../components/common/page-meta";
export default function Home() {
  // let a: null = null;
  // console.log(a);

  // let b: string = "abcc";
  // console.log(b);

  // let c: number = NaN;
  // c = "css";
  // console.log(isNaN(c));

  // function printMsg(): void {
  //   console.log("Hello");
  // }
  return (
    <>
      <PageMeta title="Home" />
      <div className="grid grid-cols-12 gap-4 md:gap-6 ">
        <div className="col-span-12 space-y-6 xl:col-span-13">
          <EcommerceMetrics />
          <RecentUsers />
        </div>
      </div>
    </>
  );
}
