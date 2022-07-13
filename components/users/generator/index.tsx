import React, {
  FunctionComponent,
  FormEvent,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useMutation, gql, MutationFunction } from "@apollo/client";
import Style from "styles/users/generator.module.scss";
import { UsersVars } from "pages/users";

interface Users_Data {
  code: string;
  date: string;
}

const Make_Users = gql`
  mutation ($n: Int!) {
    makeUsers(n: $n) {
      code
    }
  }
`;

interface MyVars {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const UserGenerator: FunctionComponent = () => {
  const usersvars: MyVars | null = useContext(UsersVars);
  const [makeusers, { data, loading }] = useMutation(Make_Users, {
    onCompleted: () => {
      usersvars?.setRefresh(true);
    },
  });

  return (
    <>
      <h4>اصنع رموز !</h4>
      <Form make={makeusers} data={data} loading={loading} />
    </>
  );
};

export default UserGenerator;

interface props_data {
  makeUsers: Users_Data[];
}
interface form_props {
  make: MutationFunction;
  data: props_data;
  loading: boolean;
}

const Form: FunctionComponent<form_props> = (props) => {
  const { make, loading, data } = props;
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<boolean | null>(null);
  let timout: ReturnType<typeof setTimeout>;
  const changeHandler = (e: FormEvent<HTMLInputElement>) => {
    clearTimeout(timout);
    if (loading) return;
    const { value } = e.currentTarget;
    const check = /^\d+$/.test(value) || value === "";
    if (check) setValue(value);
    if (parseInt(value) <= 0 || !check) return setMsg(false);
    setMsg(true);
  };
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return setMsg(false);
    clearTimeout(timout);
    if (!loading) make({ variables: { n: parseInt(value) } });
    else setMsg(true);
    setValue("");
  };

  useEffect(() => {
    if (msg === false)
      timout = setTimeout(() => {
        setMsg(true);
      }, 1000);
  }, [msg, value]);

  const display_msg = () => {
    if (loading) return "جاري اضافة العناصر";
    if (value) return value;
    if (data) return `${data.makeUsers.length} رمز تم تصنيعه`;
    if (!msg) return "رجاءا ادخل رقم صحيح";
  };
  return (
    <form className={Style.generator} onSubmit={submitHandler}>
      <input
        placeholder="do something..."
        type="text"
        value={value}
        onChange={changeHandler}
      />
      <button type={loading ? "button" : "submit"}>
        {loading ? "جاري اضافة العناصر " : "اضافة عناصر"}
      </button>
      {(msg !== null || data) && (
        <p className={!msg ? Style.wrong : Style.right}>{display_msg()}</p>
      )}
    </form>
  );
};
