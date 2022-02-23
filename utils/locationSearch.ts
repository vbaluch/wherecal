import { supabase } from "../utils/supabaseClient";
import { Location } from "../types/Location";

async function getSearchResults(searchTerm: string) {
  try {
    let { data, error, status } = await supabase
      .from<Location>("locations")
      .select(`id,name,full_name`)
      .like(`search_text`, `%${searchTerm}%`)
      .limit(5);
    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    alert(JSON.stringify(error));
  }
}

export const locationSearch = async (searchTerm: string) => {
  const searchResults = await getSearchResults(searchTerm.toLowerCase());
  return searchResults;
};
