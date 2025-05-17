import { useEffect, useState } from "react";
import useAxios from "./useAxios";
import { ChatState } from "../Context/ChatProvider";

/**
 * Custom hook for searching users in the chat application
 * 
 * This hook provides functionality to search for users by name or email,
 * handling the API call, loading state, and search results.
 * 
 * @returns {Object} Object containing search state and methods
 * @returns {string} searchTerm - The current search query
 * @returns {Function} setSearchTerm - Function to update the search query
 * @returns {Array} searchResults - List of users matching the search query
 * @returns {boolean} loading - Loading state for the search operation
 * @returns {Function} searchUsers - Function to trigger a user search
 * @returns {Object} searchAlert - Alert state for search errors
 */
const useUserSearch = () => {
  const { user } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize axios hook for user search
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
