#include <algorithm>
#include <cmath>
#include <iostream>
using namespace std;
typedef long long ll;

const int N = 5e4 + 500;
int n, q, sn;

struct Query {
    int l, r, id;
} qs[N];

// 这个写函数还是预处理的问题我在分块的时候讲了,反正我是不卡常就写函数
int blk(int x) {
    return (x - 1) / sn + 1;
}
bool cmp(const Query& a, const Query& b) {
    // 上面是没有奇偶块优化的,下面是有的
    // return blk(a.l)==blk(b.l)?a.r<b.r:a.l<b.l;
    return blk(a.l) == blk(b.l) ? ((blk(a.l) & 1) ? a.r < b.r : a.r > b.r)
                                : a.l < b.l;
}

ll anses[N];        // 答案
int lens[N];        // 区间长度
int cnts[N], a[N];  // 桶,原数组

ll ans = 0;

void add(int x) {
    ans += cnts[a[x]];
    cnts[a[x]]++;
}

void del(int x) {
    // 这里注意两行的顺序
    cnts[a[x]]--;
    ans -= cnts[a[x]];
}

ll gcd(ll a, ll b) {
    if (b == 0)
        return a;
    return gcd(b, a % b);
}

int main() {
    cin >> n >> q;
    sn = n / sqrt(q);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1; i <= q; i++) {
        cin >> qs[i].l >> qs[i].r;
        qs[i].id = i;
    }
    sort(qs + 1, qs + 1 + q, cmp);  // 排序,莫队与暴力的本质区别
    int l = 1, r = 0;
    for (int i = 1; i <= q; i++) {
        // 这里应该先扩张区间再收缩,不然在一些奇怪的地方会寄
        while (l > qs[i].l)
            add(--l);
        while (r < qs[i].r)
            add(++r);
        while (l < qs[i].l)
            del(l++);
        while (r > qs[i].r)
            del(r--);
        anses[qs[i].id] = ans;
        lens[qs[i].id] = (qs[i].r - qs[i].l + 1);
    }
    // 输出答案
    for (int i = 1; i <= q; i++) {
        ll len = lens[i];
        ll total = len * (len - 1) / 2;
        ll d = gcd(anses[i], total);
        if (anses[i])
            cout << anses[i] / d << '/' << total / d << endl;
        else
            cout << "0/1" << endl;
    }
    return 0;
}
