import { useEffect, useState } from "react";
import useAxios from "./useAxios";
import { ChatState } from "../Context/ChatProvider";

const useUserSearch = () => {
  const { user } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const userSearch = useAxios({
    method: "get",
    url: `user/listUsers?search=${search}`,
    headers: {
      authorization: "Bearer " + user.token,
    },
  });

  const [searchAlert, setSearchAlert] = useState({
    active: false,
    message: "",
    severity: "warning",
  });

  const resetAlert = () => {
    setSearchAlert({
      active: false,
      message: "",
      severity: "warning",
    });
  };

  const handleSearch = async () => {
    if (!search) return;

    setLoading(true);

    await userSearch.fetchData();
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  useEffect(() => {
    if (userSearch.response) {
      setSearchResults(userSearch.response);
      setLoading(false);
    }
  }, [userSearch]);

  return {
    searchResults,
    searchAlert,
    resetAlert,
    setSearch,
    setSearchResults,
    loading,
  };
};

export default useUserSearch;
