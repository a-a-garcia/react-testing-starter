import { Toaster } from "react-hot-toast";
import ExpandableText from "../components/ExpandableText";
import Onboarding from "../components/Onboarding";
import SearchBox from "../components/SearchBox";
import TermsAndConditions from "../components/TermsAndConditions";
import ToastDemo from "../components/ToastDemo";
import OrderStatusSelector from "../components/OrderStatusSelector";

const PlaygroundPage = () => {
  // return <Onboarding />;

  // return <TermsAndConditions />

  // return <ExpandableText text={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo ut doloribus sapiente molestias quia, reprehenderit ipsum. Animi sapiente quaerat assumenda. Distinctio porro magni nisi praesentium dolores quidem nesciunt repellendus ullam incidunt, voluptate repellat inventore sunt modi? Repudiandae impedit, labore repellat ducimus, reprehenderit quidem facilis praesentium nostrum consectetur velit aliquid sapiente!"} />

  // return <SearchBox onChange={(text) => console.log(text)}/>

  // return (
  //   <>
  //     <ToastDemo />
  //     <Toaster />
  //   </>
  // );

  return (
    // <OrderStatusSelector onChange={value => console.log(value)} />

    //whenever you have an arrow function that takes a value and passes it to a single function, you can simplify by just adding a reference to the function
    <OrderStatusSelector onChange={console.log} />
  )
};

export default PlaygroundPage;
