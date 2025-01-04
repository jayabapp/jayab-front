import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import { State, City } from "./city.interface";

export class CityService {
  /**
   * Fetch a list of states.
   *
   * This function calls the API endpoint to retrieve a list of states.
   * In case of an error or an empty response, it returns an empty array.
   *
   * @returns A promise that resolves to an array of State objects
   */
  static async fetchStates(): Promise<State[]> {
    try {
      // Calling the API to get the states
      const result = await apiCall<null, State[]>(
        "GET", // HTTP method
        apiRoutes.CITIES, // The API endpoint for fetching states
        null // No request body is needed
      );
      return result || []; // Return an empty array if no data is returned or if an error occurs
    } catch (e) {
      // If there's an error, propagate it
      throw e;
    }
  }

  /**
   * Fetch a list of cities based on the given property ID.
   *
   * This function calls the API endpoint to retrieve a list of cities.
   * If the `property_id` is provided, it is passed as part of the request URL.
   * If no property ID is given, an empty string is used.
   *
   * @param dto The data transfer object containing an optional property_id
   * @returns A promise that resolves to an array of City objects
   */
  static async fetchCities(
    property_id?: string | number | null
  ): Promise<City[]> {
    try {
      // Calling the API to get the cities with the provided property ID
      const result = await apiCall<null, City[]>(
        "GET", // HTTP method
        apiRoutes.CITIES_CHILDEREN(property_id ?? ""), // Use property_id or an empty string
        null // No request body is needed
      );
      return result || []; // Return an empty array if no data is returned or if an error occurs
    } catch (e) {
      // If there's an error, propagate it
      throw e;
    }
  }
}
