import axios from "axios";

export const getAddress = async ({
  longitude,
  latitude,
}: {
  longitude: string;
  latitude: string;
}) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching address:", error);
  }
};
