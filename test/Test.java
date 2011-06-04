interface Itf {}
public class Test implements Itf {
  private long f = 0L;
  private String s = "éüße";
  public int m(String s, int i) {
    System.out.println(s);
    int j = i * 3;
    return j;
  }
}
