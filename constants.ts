import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");
export default { width, height };

export const BUCKET_URL = "bucketeer-83bbe0a0-d809-4817-9a00-a679f587a607";
export const BACKEND_URL = `https://${BUCKET_URL}.s3.amazonaws.com`;
