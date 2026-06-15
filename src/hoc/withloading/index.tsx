import { useAppSelector } from "../../redux/hooks";

const withLoading = (WrappedComponent:any) => {
  return (props: any) => {
    const loading = useAppSelector((state) => state.ui.loading);

    if (loading) {
      return <div>Loading..</div>;
    }
    return <WrappedComponent {...props} />;
  };
};
export default withLoading;
