export interface UserPermissions {
  granted: string[];
  claims: string[];
}

export interface UserPermissionDefinition {
  claim: string;
  title: string;
  checked?: boolean;
}

export class UserPermissionDefinitions {
  static USER_VIEW = "user:view";
  static USER_CREATE = "user:create";
  static USER_UPDATE = "user:update";
  static USER_DELETE = "user:delete";

  static USER_PERMISSION_UPDATE = "user:permission:update";

  static CANDIDATE_VIEW = "candidate:view";
  static CANDIDATE_CREATE = "candidate:create";
  static CANDIDATE_UPDATE = "candidate:update";
  static CANDIDATE_DELETE = "candidate:delete";

  static INTERVIEW_VIEW = "interview:view";
  static INTERVIEW_CREATE = "interview:create";
  static INTERVIEW_UPDATE = "interview:update";
  static INTERVIEW_DELETE = "interview:delete";
  static INTERVIEW_REPORT = "interview:report";

  static INTERVIEW_QUESTION_VIEW = "interview:question:view";
  static INTERVIEW_QUESTION_CREATE = "interview:question:create";
  static INTERVIEW_QUESTION_UPDATE = "interview:question:update";
  static INTERVIEW_QUESTION_DELETE = "interview:question:delete";

  static INTERVIEW_COMMITEE_VIEW = "interview:commitee:view";
  static INTERVIEW_COMMITEE_CREATE = "interview:commitee:create";
  static INTERVIEW_COMMITEE_UPDATE = "interview:commitee:update";
  static INTERVIEW_COMMITEE_DELETE = "interview:commitee:delete";

  static INTERVIEW_CANDIDATE_VIEW = "interview:candidate:view";
  static INTERVIEW_CANDIDATE_CREATE = "interview:candidate:create";
  static INTERVIEW_CANDIDATE_UPDATE = "interview:candidate:update";
  static INTERVIEW_CANDIDATE_DELETE = "interview:candidate:delete";
  static INTERVIEW_CANDIDATE_ASSESS = "interview:candidate:assess";
  static INTERVIEW_CANDIDATE_LOG = "interview:candidate:log";

  static INTERVIEW_LANGUAGE_VIEW = "interview:language:view";
  static INTERVIEW_LANGUAGE_CREATE = "interview:language:create";
  static INTERVIEW_LANGUAGE_DELETE = "interview:language:delete";

  static INTERVIEW_CONTENTS_VIEW = "interview:contents:view";
  static INTERVIEW_CONTENTS_CREATE = "interview:contents:create";
  static INTERVIEW_CONTENTS_UPDATE = "interview:contents:update";
  static INTERVIEW_CONTENTS_DELETE = "interview:contents:delete";

  static LOG_VIEW = "log:view";

  public static getDefinitions(): UserPermissionDefinition[] {
    return [
      {
        claim: UserPermissionDefinitions.USER_VIEW,
        title: "Kullanıcıları Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.USER_CREATE,
        title: "Kullanıcı Ekleme",
      },
      {
        claim: UserPermissionDefinitions.USER_UPDATE,
        title: "Kullanıcı Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.USER_DELETE,
        title: "Kullanıcı Silme",
      },

      {
        claim: UserPermissionDefinitions.USER_PERMISSION_UPDATE,
        title: "Kullanıcı İzinleri Güncelleme",
      },

      {
        claim: UserPermissionDefinitions.CANDIDATE_VIEW,
        title: "Adayları Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.CANDIDATE_CREATE,
        title: "Aday Ekleme",
      },
      {
        claim: UserPermissionDefinitions.CANDIDATE_UPDATE,
        title: "Aday Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.CANDIDATE_DELETE,
        title: "Aday Silme",
      },

      {
        claim: UserPermissionDefinitions.INTERVIEW_VIEW,
        title: "Mülakatları Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CREATE,
        title: "Mülakat Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_UPDATE,
        title: "Mülakat Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_DELETE,
        title: "Mülakat Silme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_REPORT,
        title: "Mülakat Raporları Görme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_QUESTION_VIEW,
        title: "Mülakat Soruları Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_QUESTION_CREATE,
        title: "Mülakat Sorusu Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_QUESTION_UPDATE,
        title: "Mülakat Sorusu Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_QUESTION_DELETE,
        title: "Mülakat Sorusu Silme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_COMMITEE_VIEW,
        title: "Mülakat Komitelerini Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_COMMITEE_CREATE,
        title: "Mülakat Komitesi Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_COMMITEE_UPDATE,
        title: "Mülakat Komitesi Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_COMMITEE_DELETE,
        title: "Mülakat Komitesi Silme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_VIEW,
        title: "Mülakat Adaylarını Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_CREATE,
        title: "Mülakat Adayı Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_UPDATE,
        title: "Mülakat Adayı Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_DELETE,
        title: "Mülakat Adayı Silme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_ASSESS,
        title: "Mülakat Adayı Değerlendirme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CANDIDATE_LOG,
        title: "Mülakat Adayı Durum Logları",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_LANGUAGE_VIEW,
        title: "Mülakat Dillerini Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_LANGUAGE_CREATE,
        title: "Mülakat Dili Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_LANGUAGE_DELETE,
        title: "Mülakat Dili Silme",
      },
      {
        claim: UserPermissionDefinitions.LOG_VIEW,
        title: "Giriş Logları Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CONTENTS_VIEW,
        title: "Mülakat İçeriklerini Görüntüleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CONTENTS_CREATE,
        title: "Mülakat İçerikleri Ekleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CONTENTS_UPDATE,
        title: "Mülakat İçerikleri Güncelleme",
      },
      {
        claim: UserPermissionDefinitions.INTERVIEW_CONTENTS_DELETE,
        title: "Mülakat İçerikleri Silme",
      },
    ];
  }
}
