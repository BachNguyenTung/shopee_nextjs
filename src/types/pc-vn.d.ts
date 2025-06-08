declare module 'pc-vn' {
  export interface Province {
    code: string;
    name: string;

    [key: string]: any;
  }

  export interface District {
    code: string;
    name: string;

    [key: string]: any;
  }

  export interface Ward {
    code: string;
    name: string;

    [key: string]: any;
  }

  const ProvincesCitiesVN: {
    getProvinces: () => Province[];
    getDistrictsByProvinceCode: (provinceCode: string) => District[];
    getWardsByDistrictCode: (districtCode: string) => Ward[];
  };

  export default ProvincesCitiesVN;
}
