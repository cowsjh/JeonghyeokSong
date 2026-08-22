---
title: scikit-learn Basic
date: 2026-08-08
tags: sklearn, machine-learning
order: 
featured: false
draft: false
---

# scikit-learn Basic

1. Import
2. 
3. 실습




# Import 

```python
from sklearn.model_selection import train_test_split# 데이터 분리

from sklearn.linear_model import LinearRegression # 선형 회귀
from sklearn.linear_model import LogisticRegression # 분류 
from sklearn.linear_model import LinearRegression, Ridge, Lasso # 규제

from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score # 오차 지표

from sklearn.metrics import ( accuracy_score, precision_score,
                            recall_score, f1_score,
                            classification_report ) # 정확도 

from sklearn.feature_extraction.text import CountVectorizer# BoW
from sklearn.feature_extraction.text import TfidfVectorizer# TF-IDF
from sklearn.naive_bayes import MultinomialNB # 나이브 베이즈
from sklearn.metrics import classification_report# 평가 리포트
```

```python
x_train, x_test, y_train, y_test = train_test_split(
    x,y,
    test_size=0.2,
    random_state=42
)

model = LinearRegression()
model.fit(x_train, y_train)

y_pred = model.predict(x_test)

mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, pos_label="Presence")
rec = recall_score(y_test, y_pred, pos_label="Presence")
f1 = f1_score(y_test, y_pred, pos_label="Presence")
```

# 분류 , GridSearch
```python
#=============================================== Lasso
lasso = Pipeline([
    ("scaler", StandardScaler()),
    ("model", Lasso(alpha=3000))
])

lasso.fit(x_train, y_train)
y_pred_lasso = lasso.predict(x_test)
rmse_lasso = np.sqrt(mean_squared_error(y_test, y_pred_lasso))

print(rmse_lr, rmse_lasso)

lasso_coef = pd.Series(
    lasso.named_steps["model"].coef_,
    index=x.columns
)

print(lasso_coef)
```

```python
#=============================================== Ridge + GridSearch
param_grid = {
    "model__alpha": [0.01,0.1,1,10,100]
}
ridge_gs = GridSearchCV(
    ridge,
    param_grid,
    cv=5,
    scoring='neg_root_mean_squared_error'
)
ridge_gs.fit(x_train, y_train)
print(ridge_gs.best_params_, -ridge_gs.best_score_)
```

# 나이브 베이즈, TF-IDF
```python
# 데이터 처리용

import pandas as pd# 데이터프레임 처리

import numpy as np# 수치 계산

  

# 시각화용

import matplotlib.pyplot as plt# 그래프

import seaborn as sns# 예쁜 그래프

  

# 머신러닝 / 텍스트 처리
from sklearn.model_selection import train_test_split# 데이터 분리
from sklearn.feature_extraction.text import CountVectorizer# BoW
from sklearn.feature_extraction.text import TfidfVectorizer# TF-IDF
from sklearn.naive_bayes import MultinomialNB # 나이브 베이즈
from sklearn.metrics import classification_report# 평가 리포트

  
# SMS 스팸 데이터 URL (공용 미러)
url ="https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv"


# TSV 파일 읽기
df = pd.read_csv(url, sep='\t', header=None)


# 컬럼명 지정
df.columns = ['label','message']
df["label_num"] = df['label'].map({"ham":0,"spam":1}
  
print(df.head())

x = df["message"]
y = df["label_num"]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=.2, random_state=42, stratify=y)

bow = CountVectorizer()

x_train_bow = bow.fit_transform(x_train)
x_test_bow = bow.transform(x_test)

bow_df = pd.DataFrame(
    x_train_bow.toarray(),
    columns=bow.get_feature_names_out()
)

nb_bow = MultinomialNB()
nb_bow.fit(x_train_bow, y_train)

y_pred_bow = nb_bow.predict(x_test_bow)
print(classification_report(y_test, y_pred_bow))

tfidf = TfidfVectorizer()
  
x_train_tfidf = tfidf.fit_transform(x_train)
x_test_tfidf = tfidf.transform(x_test)
  
nb_tfidf = MultinomialNB()
nb_tfidf.fit(x_train_tfidf, y_train)
y_pred_tfidf = nb_tfidf.predict(x_test_tfidf)
print(classification_report(y_test, y_pred_tfidf))

spam_prob_bow = nb_bow.predict_proba(x_test_bow)
print(spam_prob_bow[:10])
```


# 실습
```python
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso, LogisticRegression
from sklearn.svm import LinearSVC, SVC

from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# =========================================================
# 데이터 불러오기
# =========================================================
FILE_PATH = "/content/real_data_sheet1.xlsx"
df = pd.read_excel(FILE_PATH)

print("데이터 크기:", df.shape)
print("컬럼:", list(df.columns))



# ---------------------------------------------------------
# 숫자 컬럼만 사용
# ---------------------------------------------------------
# 회귀 타깃: rpt_time_earn (수익)
# 분류 타깃: rpt_time_turn (전환 여부 -> 0/1로 변환)
target_reg = "rpt_time_earn"
target_cls = "rpt_time_turn"

num_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# 필요한 컬럼이 있는지 확인(없으면 에러)
for col in [target_reg, target_cls]:
    if col not in df.columns:
        raise ValueError(f"'{col}' 컬럼이 파일에 없습니다. 현재 컬럼을 확인하세요.")

# 결측치(빈 값) 처리: 숫자는 중앙값으로 채우기
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

# 분류 타깃을 0/1로 만들기 (전환이 1번이라도 있으면 1)
df[target_cls] = (df[target_cls] > 0).astype(int)



# =========================================================
# 회귀: 선형회귀 + MSE/RMSE/MAE + 과적합 판단
# =========================================================
print("\n" + "="*60)
print("1) 회귀(Regression): 선형회귀 + 오차지표 + 과적합 확인")

# X(입력) = 숫자 컬럼들 중 타깃 제외
feature_cols_reg = [c for c in num_cols if c != target_reg]
X = df[feature_cols_reg]
y = df[target_reg]

# train/test 분리
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 스케일링
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# 모델 학습
lin = LinearRegression()
lin.fit(X_train_s, y_train)

# 예측
pred_train = lin.predict(X_train_s)
pred_test  = lin.predict(X_test_s)

# 오차 지표 함수(간단)
def regression_metrics(y_true, y_pred):
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    return mse, rmse, mae

mse_tr, rmse_tr, mae_tr = regression_metrics(y_train, pred_train)
mse_te, rmse_te, mae_te = regression_metrics(y_test, pred_test)

print("[Train] MSE / RMSE / MAE =", round(mse_tr,4), "/", round(rmse_tr,4), "/", round(mae_tr,4))
print("[Test ] MSE / RMSE / MAE =", round(mse_te,4), "/", round(rmse_te,4), "/", round(mae_te,4))



# =========================================================
# 회귀: Ridge / Lasso 적용해서 성능 평가
# =========================================================
print("\n" + "="*60)
print("2) 회귀(Regression): Ridge / Lasso 성능 비교")

# alpha(=lambda) 몇 개만 간단히 비교
alphas = [0.01, 0.1, 1, 10, 100]

def try_reg_model(model_name, model):
    model.fit(X_train_s, y_train)
    pred_tr = model.predict(X_train_s)
    pred_te = model.predict(X_test_s)
    _, rmse_tr, _ = regression_metrics(y_train, pred_tr)
    _, rmse_te, _ = regression_metrics(y_test, pred_te)
    print(f"{model_name:10s} | Train RMSE={rmse_tr:.4f} | Test RMSE={rmse_te:.4f}")

for a in alphas:
    try_reg_model(f"Ridge a={a}", Ridge(alpha=a))
for a in alphas:
    try_reg_model(f"Lasso a={a}", Lasso(alpha=a))
    


# =========================================================
# 분류: 로지스틱 회귀 + 평가 지표 + 과적합 확인
# =========================================================
print("\n" + "="*60)
print("3) 분류(Classification): 로지스틱 회귀 + 평가 지표 + 과적합 확인")

# 분류 입력도 숫자 컬럼 사용(타깃 제외)
feature_cols_cls = [c for c in num_cols if c != target_cls]
Xc = df[feature_cols_cls]
yc = df[target_cls]

Xc_train, Xc_test, yc_train, yc_test = train_test_split(
    Xc, yc, test_size=0.2, random_state=42, stratify=yc
)

scaler_c = StandardScaler()
Xc_train_s = scaler_c.fit_transform(Xc_train)
Xc_test_s  = scaler_c.transform(Xc_test)

logit = LogisticRegression(max_iter=1000)
logit.fit(Xc_train_s, yc_train)

pred_tr = logit.predict(Xc_train_s)
pred_te = logit.predict(Xc_test_s)

def cls_metrics(y_true, y_pred):
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    return acc, prec, rec, f1

acc_tr, prec_tr, rec_tr, f1_tr = cls_metrics(yc_train, pred_tr)
acc_te, prec_te, rec_te, f1_te = cls_metrics(yc_test, pred_te)

print(f"[Train] Acc={acc_tr:.4f} Prec={prec_tr:.4f} Rec={rec_tr:.4f} F1={f1_tr:.4f}")
print(f"[Test ] Acc={acc_te:.4f} Prec={prec_te:.4f} Rec={rec_te:.4f} F1={f1_te:.4f}")



# =========================================================
# SVM: Support Vector Machine 사용해보기
# =========================================================
print("\n" + "="*60)
print("4) SVM 분류")

# 공통 함수
def eval_model(name, model):
    model.fit(Xc_train_s, yc_train)
    pred = model.predict(Xc_test_s)
    acc, prec, rec, f1 = cls_metrics(yc_test, pred)
    print(f"{name:20s} | Acc={acc:.4f} Prec={prec:.4f} Rec={rec:.4f} F1={f1:.4f}")

# 1) 선형 SVM
eval_model("Linear SVM", LinearSVC())

# # 2) RBF 커널 SVM
# eval_model("RBF SVM", SVC(kernel="rbf"))

# # 3) Polynomial 커널 SVM (degree=3)
# eval_model("Poly SVM (deg=3)", SVC(kernel="poly", degree=3))
```

---

실전 데이터로 회귀/분류/SVM을 적용한 예제는 KANT step2 머신러닝 참고.
