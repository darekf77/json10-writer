export namespace DummyNamespace {
  export namespace DepepNs {
    export namespace DepepErNs {
      export const aa = '32';
      export type PackageString = String;
    }
  }

  export type aaaa = DummyNamespace.DepepNs.DepepErNs.PackageString;
  export type bbbb = {
    ccc: DummyNamespace.DepepNs.DepepErNs.PackageString;
  };

}

export function dummyFn() {
  console.log(DummyNamespace.
    DepepNs.DepepErNs.aa);

  const aaasd = DummyNamespace.DepepNs.
  DepepErNs.aa === '32';

  const aaaasdasdsd = DummyNamespace
  .DepepNs
  .
  DepepErNs.aa === '32';
}
